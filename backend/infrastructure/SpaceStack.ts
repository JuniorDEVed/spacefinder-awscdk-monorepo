import { GenericTable } from "./GenericTable"
import { Stack, StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { Code, Function as LambdaFunction, Runtime } from "aws-cdk-lib/lib/aws-lambda"
import { LambdaIntegration, RestApi } from "aws-cdk-lib/lib/aws-apigateway"
import { join } from "path"
import { PolicyStatement } from "aws-cdk-lib/lib/aws-iam"

import { NodejsFunction } from "aws-cdk-lib/lib/aws-lambda-nodejs"

export class SpaceStack extends Stack {
  private api = new RestApi(this, "SpaceApi")
  private spacesTable = new GenericTable("SpacesTable", "spaceId", this)

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props)

    const helloLambdaNodeJs = new NodejsFunction(this, "helloLambdaNodeJs", {
      entry: join(__dirname, "..", "services", "node-lambda", "hello.ts"),
      handler: "handler",
    })
    const s3ListPolicy = new PolicyStatement()
    s3ListPolicy.addActions("s3:ListAllMyBuckets")
    s3ListPolicy.addResources("*")
    helloLambdaNodeJs.addToRolePolicy(s3ListPolicy)

    // ApiGatway and our lambda integration/association
    const helloLambdaIntegration = new LambdaIntegration(helloLambdaNodeJs)
    const helloLamdbaResource = this.api.root.addResource("hello")
    helloLamdbaResource.addMethod("GET", helloLambdaIntegration)
  }
}
