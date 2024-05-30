/* groovylint-disable CatchException, ThrowException, UnnecessarySetter */
@Library('flux7-lib@0d8168d66d33f54e6d19daaf72d9663fbf28ed5f')
import com.tri.vscode.DevContainer
import com.tri.pipeline_github.PullRequest

node('jenkins-agent') {
    properties(
        [
            disableConcurrentBuilds()
        ]
    )

    stage('Checkout Code') {
        checkout(scm)
        sh('git clean -fdx')
    }

    PullRequest pr = new PullRequest()


    stage('Parallel Checks') {
            def branches = [:]

        branches['Run Tests'] = { stage('Run Tests') {
            runTests(pr)
        }}

        branches["failFast"] = false
        parallel(branches)
    }
}

/**
 * Runs the user provided tests using the dev container and replies to the PR with the results.
 *
 * @param pr The PullRequest object for commenting on the PR.
 */
void runTests(PullRequest pr) {
    pullRequest.createStatus(status: 'pending',
        context: "Jenkins - Unit Tests",
        description: 'Starting Tests',
        targetUrl: env.JOB_URL
    )

    try {
        String outputComment
        DevContainer devContainer = new DevContainer()
        devContainer.with {
            sshagent(credentials: ['git-ssh-key']) {
                testStatus = sh(script: 'bash tests', returnStatus: true)
            }
        }

        String jobName = env.JOB_NAME.split("/")[0]
        String itemName = env.JOB_NAME.split("/")[1]

        def logContent = Jenkins.getInstance().getItemByFullName(jobName).getItem(itemName).getBuildByNumber(Integer.parseInt(env.BUILD_NUMBER)).logFile.text
        def pat = "\\[8mha.*\\[0m"
        def trimmedLog = logContent.replaceAll(pat, '')
        if (testStatus != 0) {
            pullRequest.createStatus(status: 'failure',
                context: "Jenkins - Unit Tests",
                description: 'One or more tests has failed!',
                targetUrl: env.JOB_URL
            )

            outputComment = """\
Tests failed! :boom::boom::boom: :see_no_evil:
<details><summary>Test Results</summary>
<p>

```
${trimmedLog}
```

</p>
</details>
"""
        error('One or more tests has failed!')
        } else {
            pullRequest.createStatus(status: 'success',
                context: "Jenkins - Unit Tests",
                description: 'Tests are passing',
                targetUrl: env.JOB_URL
            )

            outputComment = """\
Tests are passing! :rocket::rocket::rocket: :full_moon:
<details><summary>Test Results</summary>
<p>

```
${trimmedLog}
```

</p>
</details>
"""
        }

        pr.comment(outputComment)
    } catch (Exception ex) {
        String jobName = env.JOB_NAME.split("/")[0]
        String itemName = env.JOB_NAME.split("/")[1]
        def logContent = Jenkins.getInstance().getItemByFullName(jobName).getItem(itemName).getBuildByNumber(Integer.parseInt(env.BUILD_NUMBER)).logFile.text
        def pat = "\\[8mha.*\\[0m"
        def trimmedLog = logContent.replaceAll(pat, '')
        String comment = """\
:boom::boom::boom: :see_no_evil:
<details><summary>Test Execution Failure</summary>
<p>

```
${trimmedLog}
```

</p>
</details>
"""
        pr.comment(comment)
        abortJob('Test execution failed!')
    }
}

void setBuildName(String name) {
    currentBuild.displayName = "#${currentBuild.number} ${name}"
}


void abortJob(String reason) {
    currentBuild.result = 'ABORTED'
    error(reason)
}

String truncate(String msg) {
    String shortMsg = msg.length() <= 140 ? msg : "${msg[0..136]}..."
    return shortMsg
}

void withCheck(String checkName, Closure userCode) {
    pullRequest.createStatus(
        status: 'pending',
        context: "Jenkins - ${checkName}",
        description: "Starting ${checkName}",
        targetUrl: env.BUILD_URL
    )

    try {
        userCode()
        pullRequest.createStatus(
            status: 'success',
            context: "Jenkins - ${checkName}",
            description: "${checkName} has passed!",
            targetUrl: env.BUILD_URL
        )
    } catch (Exception ex) {
        pullRequest.createStatus(
            status: 'failure',
            context: "Jenkins - ${checkName}",
            description: truncate(ex.getMessage()),
            targetUrl: env.BUILD_URL
        )
        throw ex
    }
}
