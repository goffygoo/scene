import HelpChat from "../../model/HelpChat.js";
import Issue from "../../model/Issue.js"
import User from "../../model/User.js";
import CommsModule from "../comms/index.js";

const sendMessageByUser = async (userId, message) => {
    const issue = await Issue.findOne({
        userId,
        resolved: false,
    });
    let issueId = issue?._id.toString();
    if (!issueId) {
        const newIssue = await Issue.create({
            userId,
            summary: message,
        })
        issueId = newIssue?._id.toString();
    }
    await HelpChat.create({
        issueId,
        message,
        isUser: true,
    });
}

const getMessagesByIssueId = async (issueId, fromTimestamp) => {
    return HelpChat.find({
        issueId,
        ...(fromTimestamp && {
            createdAt: { $gte: fromTimestamp }
        })
    });
}

const getMessagesByUserId = async (userId, fromTimestamp) => {
    const issue = await Issue.findOne({
        userId,
        resolved: false,
    });
    let issueId = issue?._id.toString();
    if (!issueId) return [];
    return getMessagesByIssueId(issueId, fromTimestamp);
}

const getOpenIssues = async () => {
    return Issue.find({
        resolved: false,
    });
}

const getAllIssues = async (userId) => {
    return Issue.find({
        assignedTo: userId,
        resolved: false,
    });
}

const assignIssue = async (issueId, userId) => {
    const issue = await Issue.findById(issueId);
    if (!issue) throw Error('Invalid Issue Id');
    if (issue.assignedTo) throw Error('Already Assigned');
    return Issue.findByIdAndUpdate(issueId, {
        assignedTo: userId,
    });
}

const getMessages = async (issueId, fromTimestamp) => {
    const issue = await Issue.findById(issueId);
    if (!issue) throw Error('Invalid Issue Id');
    const messages = await getMessagesByIssueId(issueId, fromTimestamp);
    const user = await User.findOneAndSelect(
        {
            _id: issue.userId
        },
        {
            email: 1,
            profile: 1,
            profileComplete: 1
        }
    );
    return {
        messages,
        user
    }
}

const resolveIssue = async (issueId) => {
    return Issue.findByIdAndUpdate(issueId, {
        resolved: true,
    })
}

const replyOnIssue = async (issueId, message) => {
    const issue = await Issue.findById(issueId);
    if (!issue) throw Error('Invalid Issue Id');
    await HelpChat.create({
        issueId,
        message,
        isUser: false,
    });
    const userId = issue.userId.toString();
    await CommsModule.notification.pushToUser.helpChat(userId, { message });
}

export default {
    sendMessageByUser,
    getMessagesByUserId,
    getMessagesByIssueId,
    getOpenIssues,
    getAllIssues,
    assignIssue,
    getMessages,
    resolveIssue,
    replyOnIssue,
}
