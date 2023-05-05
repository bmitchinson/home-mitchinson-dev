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
}
