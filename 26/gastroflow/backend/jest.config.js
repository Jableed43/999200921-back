export default {
    testEnvironment: 'node',
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
    setupFilesAfterEnv: ['./src/tests/setup.js'],
    verbose: true,
    forceExit: true,
}
