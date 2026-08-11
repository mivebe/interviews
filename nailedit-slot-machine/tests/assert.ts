let passed = 0;
const failures: string[] = [];

export function test(name: string, body: () => void): void {
    try {
        body();
        passed++;
    } catch (error) {
        failures.push(`${name}: ${(error as Error).message}`);
    }
}

export function assert(condition: boolean, message: string): void {
    if (!condition) {
        throw new Error(message);
    }
}

export function assertEqual(actual: unknown, expected: unknown, message: string): void {
    const actualText = JSON.stringify(actual);
    const expectedText = JSON.stringify(expected);
    if (actualText !== expectedText) {
        throw new Error(`${message}\n    expected ${expectedText}\n    received ${actualText}`);
    }
}

export function report(suiteName: string): void {
    if (failures.length === 0) {
        console.log(`${suiteName}: ${passed} passed`);
        return;
    }

    console.log(`${suiteName}: ${passed} passed, ${failures.length} failed`);
    for (const failure of failures) {
        console.log(`  FAIL ${failure}`);
    }

    const host = globalThis as { process?: { exitCode?: number } };
    if (host.process) {
        host.process.exitCode = 1;
    }
}
