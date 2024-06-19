import { httpRequest } from "../util/index.js";
import config from "../constants/config.js";

const { WORKFLOW_ORCHESTRATOR, WORKFLOW_ORCHESTRATOR_SECRET } = config;

const orchestratorConfig = {
    headers: {
        Authorization: `${WORKFLOW_ORCHESTRATOR_SECRET}`
    }
}

const run = async () => {
    const argv = process.argv;
    const workflowKey = argv[2];
    let success = true;
    try {
        const workflowName = argv[3];
        const params = argv[4] ? JSON.parse(argv[4]) : {};
        const workflow = await import(`./${workflowName}.js`);
        const fn = workflow.default;
        await fn(params);
    } catch (_e) {
        success = false;
    }
    await httpRequest(
        "post",
        `${WORKFLOW_ORCHESTRATOR}/terminated`,
        {
            workflowKey,
            success,
        },
        orchestratorConfig
    );
}

run().then(() => {
    console.log("Workflow executed successfully.");
    process.exit(0);
}).catch((err) => {
    console.log(err);
    process.exit(-1);
});