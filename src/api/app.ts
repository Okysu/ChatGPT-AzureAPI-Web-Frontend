import request from ".";

/**
 * getPrompts
 */
export const getPrompts = () => {
  return request.get("/prompts");
};

/**
 * getModels
 */
export const getModels = () => {
  return request.get("/");
};
