module.exports = {
  projects: [
    {
      displayName: "unit-tests",
      preset: "@jameslnewell/jest-preset-test",
      testMatch: [
        "<rootDir>/(configs|examples|scripts|utilities)/*/(src|test)/**/*.test?(s).ts?(x)"
      ],
      moduleNameMapper: {
        "^@tradie/(.*)-config$": "<rootDir>/configs/$1/src",
        "^@tradie/(.*)-example$": "<rootDir>/examples/$1/src",
        "^@tradie/(.*)-scripts$": "<rootDir>/scripts/$1/src",
        "^@tradie/(.*)-utils$": "<rootDir>/utilities/$1/src"
      }
    }
  ]
};
