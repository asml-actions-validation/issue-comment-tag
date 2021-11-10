import * as core from '@actions/core'
import {Octokit} from 'octokit'
import dotenv from 'dotenv'

// always import the config
dotenv.config()

async function run(): Promise<void> {
  core.info('Starting')
  try {
    const PAT = core.getInput('GITHUB_TOKEN') || process.env.GITHUB_TOKEN || ''
    const issue = core.getInput('issue') || process.env.issue || ''
    const team = core.getInput('team') || process.env.team || ''

    if (!PAT || PAT === '') {
      core.setFailed(
        "Cannot load 'GITHUB_TOKEN' which is required to be able to post the issue"
      )
      return
    }

    if (team === '' && issue === '') {
      core.setFailed(
        "Both parameters 'team' or 'issue' is required to load all actions from it. Please provide one of them."
      )
      return
    }

    core.info(`Parameters that we have. Issue: [${issue}], team: [${team}] and a token with length: [${PAT.length}]`)

    const octokit = new Octokit({auth: PAT})

    try {
      const currentUser = await octokit.rest.users.getAuthenticated()

      core.info(`Hello, ${currentUser.data.login}`)
    } catch (error) {
      core.setFailed(
        `Could not authenticate with GITHUB_TOKEN. Please check that it is correct and that it has [read access] to the organization or user account: ${error}`
      )
      //return
    }

    try {
      const currentUser = await octokit.rest.repos.()

      core.info(`Hello, ${currentUser.data.login}`)
    } catch (error) {
      core.setFailed(
        `Could not authenticate with GITHUB_TOKEN. Please check that it is correct and that it has [read access] to the organization or user account: ${error}`
      )
      //return
    }

    core.info('completed')
    } catch (error) {
      core.setFailed(`Error running action: : ${error.message}`)
    }
}

run()