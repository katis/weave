/**
 * Based on the code of Playwright
 * https://github.com/microsoft/playwright/blob/69c9e985bf245625d4cc8e3360c6b63930544ab4/packages/playwright/src/common/fixtures.ts
 *
 * Copyright Microsoft Corporation. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const filterOutComments = (str: string): string => {
  const result: string[] = [];
  let commentState: "none" | "singleline" | "multiline" = "none";
  for (let i = 0; i < str.length; ++i) {
    if (commentState === "singleline") {
      if (str[i] === "\n") commentState = "none";
    } else if (commentState === "multiline") {
      if (str[i - 1] === "*" && str[i] === "/") commentState = "none";
    } else if (commentState === "none") {
      if (str[i] === "/" && str[i + 1] === "/") {
        commentState = "singleline";
      } else if (str[i] === "/" && str[i + 1] === "*") {
        commentState = "multiline";
        i += 2;
      } else {
        result.push(str[i]);
      }
    }
  }
  return result.join("");
};

const splitByComma = (str: string) => {
  const result: string[] = [];
  const stack: string[] = [];
  let start = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "{" || str[i] === "[") {
      stack.push(str[i] === "{" ? "}" : "]");
    } else if (str[i] === stack[stack.length - 1]) {
      stack.pop();
    } else if (!stack.length && str[i] === ",") {
      const token = str.substring(start, i).trim();
      if (token) result.push(token);
      start = i + 1;
    }
  }
  const lastToken = str.substring(start).trim();
  if (lastToken) result.push(lastToken);
  return result;
};

export const parseDependencyNames = (fn: (deps: object) => any): string[] => {
  const text = filterOutComments(fn.toString());
  const match = text.match(/(?:async)?(?:\s+function)?[^(]*\(([^)]*)/);
  if (!match) return [];
  const trimmedParams = match[1].trim();
  if (!trimmedParams) return [];
  const [firstParam] = splitByComma(trimmedParams);
  if (firstParam[0] !== "{" || firstParam[firstParam.length - 1] !== "}") {
    throw Error(
      "First argument must use the object destructuring pattern: " + firstParam
    );
  }
  const props = splitByComma(
    firstParam.substring(1, firstParam.length - 1)
  ).map((prop) => {
    const colon = prop.indexOf(":");
    return colon === -1 ? prop.trim() : prop.substring(0, colon).trim();
  });
  const restProperty = props.find((prop) => prop.startsWith("..."));
  if (restProperty) {
    throw Error(
      `Rest property "${restProperty}" is not supported. List all used fixtures explicitly, separated by comma.`
    );
  }
  return props;
};
