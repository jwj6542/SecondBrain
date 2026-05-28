// PoCWidgetEngine.test.ts: Unit and Integration Test Suite for the Widget Engine

import { PoCWidgetEngine, MockingServiceAPI } from '../services/PoCWidgetEngine';

describe('PoCWidgetEngine End-to-End Testing', () => {
    let mockService: MockingServiceAPI;
    let engine: PoCWidgetEngine;
    const dummyData = { price: 100, volume: 'high' };

    beforeEach(() => {
        // Use a fresh instance before each test to ensure isolation
        mockService = new MockingServiceAPI();
        engine = new PoCWidgetEngine(mockService);
    });

    it('✅ Test 1: Should initialize correctly and set initial state', async () => {
        expect(engine.currentState).toBe('INPUT_DATA');
    });

    it('✅ Test 2: Full cycle execution when market is stable (Success Path)', async () => {
        // Mocking API for this specific test to ensure a 'non-collapse' outcome
        jest.spyOn(mockService, 'runDeepAnalysis').mockResolvedValueOnce({ riskScore: 0.4, stabilityIndex: 0.8 });
        jest.spyOn(mockService, 'calculateCollapseSeverity').mockResolvedValue('LOW');
        jest.spyOn(mockService, 'generateMitigationReport').mockResolvedValue('[SUCCESS] Stable market.');

        const result = await engine.runFullCycle(dummyData);
        expect(result).toContain("[SUCCESS]");
        // State should still be in a final, stable state (or SOLUTION_PROPOSAL)
        expect(engine.currentState).toBe('SOLUTION_PROPOSAL'); 
    });

    it('✅ Test 3: Full cycle execution when collapse signal is detected (Critical Path)', async () => {
        // Mocking API for this specific test to ensure a 'collapse' outcome
        jest.spyOn(mockService, 'runDeepAnalysis').mockResolvedValueOnce({ riskScore: 0.9, stabilityIndex: 0.1 }); // Low Index, High Risk
        jest.spyOn(mockService, 'calculateCollapseSeverity').mockResolvedValue('CRITICAL');
        jest.spyOn(mockService, 'generateMitigationReport').mockResolvedValue('[ALERT] Buy our Premium Diagnostic Report!');

        const result = await engine.runFullCycle(dummyData);
        expect(result).toContain("[SUCCESS]"); // The process completes successfully even if the signal is bad
        expect(engine.currentState).toBe('SOLUTION_PROPOSAL'); 
    });

    it('❌ Test 4: Should fail and revert state if Step 1 (Input Data) fails', async () => {
        // Mocking API to simulate failure in preprocessing
        jest.spyOn(mockService, 'preprocess').mockRejectedValueOnce(new Error("API connection timeout"));
        
        const result = await engine.runFullCycle(dummyData);
        expect(result).toContain("[FAILURE]");
        expect(engine.currentState).toBe('ERROR'); 
    });

});