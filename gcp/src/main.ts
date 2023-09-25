import * as config from 'config'
import * as fs from 'fs'
import * as path from 'path'
import { Construct } from 'constructs'
import { App, GcsBackend, TerraformOutput, TerraformStack } from 'cdktf'
import { GoogleProvider } from '../.gen/providers/google/provider'
import { CloudRunInjectSource, CloudRunResource } from './resource/cloudRun'
import {
    ContainerRegistryInjectSource,
    ContainerRegistryResource,
} from './resource/containerRegistry'
import { CloudRunServiceConfig } from '../config/entities/cloudRun'
import { CloudRunService } from '../.gen/providers/google/cloud-run-service'
import { ContainerRegistry } from '../.gen/providers/google/container-registry'

const REGION = process.env.REGION as string
const PROJECT_ID = process.env.PROJECT_ID as string
const PROJECT_NAME = process.env.PROJECT_NAME as string
const BUCKET_NAME = `${PROJECT_ID}-cdktf`

/// fetch functions
const _fetchCredentials = (serviceAccountJsonFileName: string): string => {
    const credentialsPath = path.join(
        process.cwd(),
        '../serviceAccounts/',
        serviceAccountJsonFileName
    )
    if (!fs.existsSync(credentialsPath)) {
        throw Error(`Credentials file not found: ${serviceAccountJsonFileName}`)
    }
    return fs.readFileSync(credentialsPath).toString()
}

const _fetchCloudRunConfigs = (instanceName: string): CloudRunServiceConfig => {
    return config.get<CloudRunServiceConfig>(`cloudRun.${instanceName}`)
}

class AppStack extends TerraformStack {
    /**
     * Create Backend, Provider resources
     */
    private _setupInfrastructure(source: {
        projectID: string
        region: string
        bucketName: string
        credentials: string
    }) {
        const { projectID, region, bucketName, credentials } = source
        new GcsBackend(this, {
            bucket: bucketName,
            prefix: 'terraform/state',
            credentials,
        })
        new GoogleProvider(this, 'GoogleAuth', {
            region,
            zone: `${region}-c`,
            project: projectID,
            credentials,
        })
    }

    private _genContainerRegisty = (source: {
        baseSource: {
            projectID: string
            projectName: string
            serviceName: string
            region: string
            serviceAccountName: string
        }
        containerRegistrySource: ContainerRegistryInjectSource
        registryName: string
    }): ContainerRegistry => {
        const { baseSource, containerRegistrySource, registryName } = source
        const { projectID, projectName, serviceName, region, serviceAccountName } = baseSource
        return new ContainerRegistryResource(
            this,
            projectID,
            projectName,
            serviceName,
            region,
            serviceAccountName
        )
            .inject(containerRegistrySource)
            .gen({ registryName })
    }

    private _genCloudRun = (source: {
        baseSource: {
            projectID: string
            projectName: string
            serviceName: string
            region: string
            serviceAccountName: string
        }
        cloudRunSource: CloudRunInjectSource
        cloudRunName: string
    }): CloudRunService => {
        const { projectID, projectName, serviceName, region, serviceAccountName } =
            source.baseSource
        const { cloudRunSource, cloudRunName } = source
        return new CloudRunResource(
            this,
            projectID,
            projectName,
            serviceName,
            region,
            serviceAccountName
        )
            .inject(cloudRunSource)
            .gen({ cloudRunName })
    }

    constructor(scope: Construct, projectName: string) {
        super(scope, projectName)

        const serviceAccountJsonFileName = config.get<string>('serviceAccountJsonFileName')
        const credentials = _fetchCredentials(serviceAccountJsonFileName)
        const credJSON = JSON.parse(credentials)

        const baseSource = {
            projectID: PROJECT_ID,
            region: REGION,
            serviceAccountName: credJSON.client_email,
            projectName,
            serviceName: PROJECT_NAME,
        }

        this._setupInfrastructure({
            ...baseSource,
            bucketName: BUCKET_NAME,
            credentials,
        })

        const containerRegistry = this._genContainerRegisty({
            baseSource,
            containerRegistrySource: {
                location: 'asia',
            },
            registryName: `${PROJECT_ID}-${projectName}-containerregistry-app`,
        })
        new TerraformOutput(this, 'appContainerRegistry', {
            value: containerRegistry.bucketSelfLink,
        })

        // NOTE: 初回デプロイ時(imageデプロイ前)はfalseにしてください。
        if (true) {
            const cloudRunSource = _fetchCloudRunConfigs('gollumApp') as any
            const apiCloudRunInstance = this._genCloudRun({
                baseSource,
                cloudRunSource,
                cloudRunName: `${PROJECT_ID}-${projectName}-cloudrun-app`,
            })
            new TerraformOutput(this, 'appApiCloudRunInstanceURL', {
                value: apiCloudRunInstance.status.get(0).url,
            })
        }
    }
}

const app = new App()

new AppStack(app, PROJECT_NAME)

app.synth()
