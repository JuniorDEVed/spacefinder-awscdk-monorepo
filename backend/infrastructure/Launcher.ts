import { SpaceStack } from "./SpaceStack"
import { App } from "aws-cdk-lib"

const app = new App()

const envLondon = { account: "444212982395", region: "eu-west-2" }

new SpaceStack(app, "space-finder-eu", {
  stackName: "SpaceFinder",
  env: envLondon,
})
