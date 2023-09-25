import {
    CloudRunService,
    CloudRunServiceConfig,
    CloudRunServiceTemplate,
    CloudRunServiceTemplateSpecContainers,
} from '../../.gen/providers/google/cloud-run-service'
import { CloudRunServiceIamPolicy } from '../../.gen/providers/google/cloud-run-service-iam-policy'
import { DataGoogleIamPolicy } from '../../.gen/providers/google/data-google-iam-policy'
import { Template } from './template'

export interface CloudRunInjectSourceSpec {
    containerConcurrency: number
    serviceAccountName: string
    timeoutSeconds: number
    containers: CloudRunServiceTemplateSpecContainers[]
}

export interface CloudRunInjectSourceMetadata {
    annotations: { [key: string]: string }
}

export interface CloudRunInjectSource {
    spec: CloudRunInjectSourceSpec
    metadata: CloudRunInjectSourceMetadata
    authorizedInvokers: string[]
}

export class CloudRunResource extends Template {
    injectSource?: CloudRunInjectSource
    inject(data: CloudRunInjectSource): CloudRunResource {
        if (this._isInjected) throw Error('already called inject()')
        this.injectSource = data
        return this
    }

    gen(data: { cloudRunName: string }): CloudRunService {
        if (!this._isInjected) throw Error('inject() must be called before gen()')
        const { spec, metadata, authorizedInvokers } = this.injectSource!
        const cloudRunServiceTemplate: CloudRunServiceTemplate = {
            spec: spec,
            metadata: metadata,
        }

        const { cloudRunName } = data
        const cloudRunServiceConfig: CloudRunServiceConfig = {
            location: this.region,
            name: cloudRunName,
            template: cloudRunServiceTemplate,
            autogenerateRevisionName: true,
            traffic: [
                {
                    percent: 100,
                    latestRevision: true,
                },
            ],
        }
        const appCloudrun = new CloudRunService(this.scope, cloudRunName, cloudRunServiceConfig)
        const policyData = new DataGoogleIamPolicy(this.scope, 'appContainerAccessPolicy', {
            binding: [
                {
                    role: 'roles/run.invoker',
                    members: authorizedInvokers,
                },
            ],
        })

        new CloudRunServiceIamPolicy(this.scope, 'runsvciampolicy', {
            location: this.region,
            project: appCloudrun.project,
            service: appCloudrun.name,
            policyData: policyData.policyData,
        })
        return appCloudrun
    }

    private get _isInjected(): boolean {
        return this.injectSource !== undefined
    }
}
