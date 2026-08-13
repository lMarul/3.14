import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async () => {
    // In a real app, you would fetch this from ctx.db
    return ["Buy milk", "Walk the dog", "Build an app"];
  },
});
