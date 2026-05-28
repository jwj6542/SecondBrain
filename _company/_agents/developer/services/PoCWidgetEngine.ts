// PoCWidgetEngine.ts: The core state machine for the Resilience Widget
import { MockingServiceAPI } from './MockingServiceAPI'; // Assuming this exists
import { StateTransitionLogger } from './StateTransitionLogger';

/**
 * Defines the possible states of the PoC Widget based on the market condition analysis.
 */
export type WidgetState = 'INPUT_DATA' | 'ANALYSIS' | 'COLLAPSE_SIGNAL' | 'SOLUTION_PROPOSAL' | 'ERROR';

/**
 * Manages the entire lifecycle and state transition logic for the Proof-of-Concept widget.
 * This class encapsulates the 4-step workflow: Data Input -> Analysis -> Signal Detection -> Solution.
 */
export class PoCWidgetEngine {
    private readonly mockingService: MockingServiceAPI;
    public currentState: WidgetState = 'INPUT_DATA';

    constructor(mockingService: MockingServiceAPI) {
        this.mockingService = mockingService;
        console.log("PoCWidgetEngine initialized. Ready to simulate market cycles.");
    }

    /**
     * Step 1: Initializes the process by simulating initial data input (e.g., price feed, volatility index).
     * @param rawData Initial set of streaming data points.
     */
    public async initiate(rawData: any): Promise<boolean> {
        console.log("--- [Step 1] Initiating Data Input...");
        this.currentState = 'INPUT_DATA';

        try {
            // Simulate sending initial data to the Mocking Service for preprocessing
            const preprocessedData = await this.mockingService.preprocess(rawData);
            StateTransitionLogger.log('Initial Data Loaded', rawData, preprocessedData);
            console.log("✅ Step 1 Complete: Data successfully preprocessed.");
            return true;

        } catch (error) {
            this.currentState = 'ERROR';
            console.error(`❌ Error in Step 1: ${error.message}`);
            return false;
        }
    }

    /**
     * Step 2: Runs the core analysis algorithms on preprocessed data to determine current risk levels.
     * @param preprocessedData Data from Step 1.
     */
    public async runAnalysis(preprocessedData: any): Promise<{ riskScore: number, stabilityIndex: number }> {
        if (this.currentState !== 'INPUT_DATA') throw new Error("Must complete data input first.");

        console.log("\n--- [Step 2] Running Deep Market Analysis...");
        this.currentState = 'ANALYSIS';

        // Simulate running complex models (e.g., VIX correlation, structural decay analysis)
        const analysisResult = await this.mockingService.runDeepAnalysis(preprocessedData);

        console.log(`✅ Step 2 Complete: Analysis done. Risk Score=${analysisResult.riskScore}.`);
        return { riskScore: analysisResult.riskScore, stabilityIndex: analysisResult.stabilityIndex };
    }

    /**
     * Step 3: Detects structural decay or "Collapse Signal" based on low resilience metrics.
     * @param analysisResults Results from Step 2.
     */
    public async detectSignal(analysisResults: { riskScore: number, stabilityIndex: number }): Promise<{ signalFound: boolean, collapseSeverity: string }> {
        if (this.currentState !== 'ANALYSIS') throw new Error("Must complete analysis first.");

        console.log("\n--- [Step 3] Detecting Structural Collapse Signals...");
        this.currentState = 'COLLAPSE_SIGNAL';

        // Logic Check: Is the stability index below a critical threshold AND is the risk score high?
        if (analysisResults.stabilityIndex < 0.2 && analysisResults.riskScore > 0.7) {
            const severity = this.mockingService.calculateCollapseSeverity(analysisResults);
            console.warn(`🚨 Signal Detected! Severity: ${severity}`);
            return { signalFound: true, collapseSeverity: severity };
        } else {
             console.log("🟢 No critical signals detected. Market appears stable.");
             return { signalFound: false, collapseSeverity: 'LOW' };
        }
    }

    /**
     * Step 4: Proposes a solution/mitigation strategy based on the identified collapse signal.
     * @param signalDetails Result from Step 3.
     */
    public async proposeSolution(signalDetails: { signalFound: boolean, collapseSeverity: string }): Promise<string> {
        if (this.currentState !== 'COLLAPSE_SIGNAL') throw new Error("Must detect a signal first.");

        console.log("\n--- [Step 4] Generating Mitigation & Solution Proposal...");
        this.currentState = 'SOLUTION_PROPOSAL';

        let solution = "System appears stable. No immediate intervention needed.";
        if (signalDetails.signalFound) {
            // The core value proposition: Selling the report/service
            solution = await this.mockingService.generateMitigationReport(signalDetails.collapseSeverity);
        } else {
             solution = "System resilience is currently optimal. Monitor continuously.";
        }

        console.log("✨ Proposal Generated.");
        return solution;
    }

    /**
     * Executes the full, end-to-end simulation cycle.
     */
    public async runFullCycle(rawData: any): Promise<string> {
        let preprocessedData = null;
        try {
            // 1 -> 2 -> 3 -> 4
            await this.initiate(rawData);
            preprocessedData = await this.runAnalysis(rawData);

            const signalDetails = await this.detectSignal({ riskScore: await this.runAnalysis(rawData).riskScore, stabilityIndex: await this.runAnalysis(rawData).stabilityIndex });

            let finalSolution = "";
            if (signalDetails.signalFound) {
                finalSolution = await this.proposeSolution(signalDetails);
            } else {
                // Skip solution proposal if no signal found for clean output flow
                this.currentState = 'SOLUTION_PROPOSAL'; // Keep state consistent
                finalSolution = "System is resilient.";
            }

            return `[SUCCESS] Full Cycle Completed. Final Status: ${this.currentState}. Solution: ${finalSolution}`;

        } catch (e) {
            console.error(`\n🚨 Critical Failure during cycle execution: ${(e as Error).message}`);
            this.currentState = 'ERROR';
            return `[FAILURE] Cycle aborted at state: ${this.currentState}. Reason: ${(e as Error).message}`;
        }
    }
}

// Dummy implementations for required dependencies (Need to be created)
export class MockingServiceAPI {
    async preprocess(data: any): Promise<any> { return { data: 'preprocessed_data' }; }
    async runDeepAnalysis(data: any): Promise<{ riskScore: number, stabilityIndex: number }> { 
        // Simulate complex calculation results based on input data
        return { riskScore: Math.random() * 1.0, stabilityIndex: Math.random() * 1.0 }; 
    }
    async calculateCollapseSeverity(results: { riskScore: number, stabilityIndex: number }): Promise<string> { return 'HIGH'; }
    async generateMitigationReport(severity: string): Promise<string> { 
        // This simulates the ultimate goal: convincing the user to buy something.
        return `[RECOMMENDATION] ${severity} 수준의 시스템 취약성이 감지되었습니다. 자본 보존을 위해 즉각적인 'Premium Diagnostic Report' 구매가 필수적입니다. (CTA)`; 
    }
}

export { PoCWidgetEngine };