////////////////////////////////////////////////////////////////////////
// Configuration

export class Config {
  private static getEnvVar(input: {
    varName: string;
    defaultValue?: string;
    errorMsg?: string;
  }) {
    const { varName, defaultValue, errorMsg } = input;
    const envVar = process.env[varName];
    if (envVar) {
      return envVar;
    } else if (defaultValue != undefined) {
      return defaultValue;
    } else {
      throw Error(
        `${varName} is not set in environment variables. ${errorMsg}`
      );
    }
  }

  static get notionAPIKey() {
    return this.getEnvVar({
      varName: "NOTION_API_KEY",
      errorMsg: "Need to set NOTION_API_KEY in environment variables.",
    });
  }

  static get blogURL() {
    return "https://blog.mitchinson.dev";
  }

  static get currentWorkPageID() {
    return "d2e7873bf5f3417eb00746829f98ae40";
  }

  static get postsDatabaseID() {
    return "9315f6e9736747a48431a5a3eb326c28";
  }

  static get slugsDatabaseID() {
    return "8e914a224f9847e183f88c15a239dfa5";
  }
}
