import User from "../../model/User.js";
import HelpModule from "../help/index.js";

const getOpenIssues = async () => {
  return HelpModule.support.getOpenIssues();
};

const assignIssue = async ({ body, locals }) => {
  const { issueId } = body;
  const { userData } = locals;
  const { userId } = userData;
  return HelpModule.support.assignIssue(issueId, userId);
};


const getAllIssues = async ({ locals }) => {
  const { userData } = locals;
  const { userId } = userData;
  return HelpModule.support.getAllIssues(userId);
};

const getMessagesForIssue = async ({ body }) => {
  const { issueId, fromTimeStamp } = body;
  return HelpModule.support.getMessages(issueId, fromTimeStamp);
};

export default {
  service: {
    getOpenIssues,
    assignIssue,
    getAllIssues,
    getMessagesForIssue,
  },
};