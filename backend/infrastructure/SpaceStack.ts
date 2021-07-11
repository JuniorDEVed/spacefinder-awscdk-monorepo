import { Stack, StackProps } from "aws-cdk-lib"
import { LambdaIntegration, RestApi } from "aws-cdk-lib/lib/aws-apigateway"
import { PolicyStatement } from "aws-cdk-lib/lib/aws-iam"
import { NodejsFunction } from "aws-cdk-lib/lib/aws-lambda-nodejs"
import { Construct } from "constructs"
import { join } from "path"

import { GenericTable } from "./GenericTable"

export class SpaceStack extends Stack {
  private api = new RestApi(this, "SpaceApi")

  private spacesTable = new GenericTable(this, {
    tableName: "SpacesTable",
    primaryKey: "spaceId",
    createLambdaPath: "Create",
  })

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

    // Spaces API integrations:
    const spaceResource = this.api.root.addResource("spaces")
    spaceResource.addMethod("POST", this.spacesTable.createLambdaIntagration)
  }
}
