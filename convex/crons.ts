import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

/** Auto-publish drafts when scheduledPublishAt is reached (PROD + DEV). */
crons.interval(
  "publish due scheduled articles",
  { minutes: 10 },
  internal.scheduledPublish.runScheduledPublish,
);

export default crons;
