import {
    ContainerRegistry,
    ContainerRegistryConfig,
} from '../../.gen/providers/google/container-registry'
import { Template } from './template'

export interface ContainerRegistryInjectSource {
    location: string
}

export class ContainerRegistryResource extends Template {
    injectSource?: ContainerRegistryInjectSource
    inject(data: ContainerRegistryInjectSource): ContainerRegistryResource {
        if (this._isInjected) throw Error('already called inject()')
        this.injectSource = data
        return this
    }

    gen(data: { registryName: string }): ContainerRegistry {
        if (!this._isInjected) throw Error('inject() must be called before gen()')
        const containerRegistryConfig: ContainerRegistryConfig = {
            ...this.injectSource,
            project: this.projectID,
        }
        return new ContainerRegistry(this.scope, data.registryName, containerRegistryConfig)
    }

    private get _isInjected(): boolean {
        return this.injectSource !== undefined
    }
}
