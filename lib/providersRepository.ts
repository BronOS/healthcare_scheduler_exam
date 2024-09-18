import {HealthcareProvider, NewHealthcareProvider, UpdateHealthcareProvider} from "../interfaces/types";
import {v4 as uuidv4} from 'uuid';
import {promises as fs, readFileSync} from 'fs';
import {injectable} from "inversify";
import {Mutex} from "async-mutex";

export interface ProvidersRepository {
    create(provider: NewHealthcareProvider): Promise<HealthcareProvider>;

    update(provider: UpdateHealthcareProvider): Promise<HealthcareProvider>;

    delete(id: string): Promise<void>;

    findById(id: string): Promise<HealthcareProvider | undefined>;

    findAll(): Promise<HealthcareProvider[]>;
}

@injectable()
export class FileProvidersRepository implements ProvidersRepository {

    constructor(
        private readonly filePath: string,
        private readonly cache: Map<string, HealthcareProvider> = new Map(),
        private readonly mutex = new Mutex(),
    ) {
        // warm up the cache at startup
        this.load().forEach(provider => {
            this.cache.set(provider.id, provider);
        });
    }

    /**
     * Create a new provider using a mutex to avoid race conditions.
     *
     * @param provider
     */
    create(provider: NewHealthcareProvider): Promise<HealthcareProvider> {
        return this.mutex.runExclusive(async () => {
            const id = uuidv4();
            const newProvider = {...provider, id};
            this.cache.set(newProvider.id, newProvider);
            await this.flush(Array.from(this.cache.values()));
            return newProvider;
        });
    }

    /**
     * Delete a provider by id using a mutex to avoid race conditions.
     *
     * @param id
     * @throws Error if the provider is not found
     */
    delete(id: string): Promise<void> {
        return this.mutex.runExclusive(async () => {
            // check if the provider exists first
            const provider = this.cache.get(id);
            if (!provider) {
                throw new Error(`Provider with id ${id} not found`);
            }

            this.cache.delete(id);
            await this.flush(Array.from(this.cache.values()));
        });
    }

    /**
     * Find all providers.
     */
    findAll(): Promise<HealthcareProvider[]> {
        return this.mutex.runExclusive(async () => {
            return Array.from(this.cache.values());
        });
    }

    /**
     * Find a provider by id.
     *
     * @param id
     */
    findById(id: string): Promise<HealthcareProvider | undefined> {
        return this.mutex.runExclusive(async () => {
            return this.cache.get(id);
        });
    }

    /**
     * Update a provider by id using a mutex to avoid race conditions.
     *
     * @param provider
     * @throws Error if the provider is not found
     */
    update(provider: UpdateHealthcareProvider): Promise<HealthcareProvider> {
        return this.mutex.runExclusive(async () => {
            // check if the provider exists first
            const existingProvider = this.cache.get(provider.id);
            if (!existingProvider) {
                throw new Error(`Provider with id ${provider.id} not found`);
            }

            const updatedProvider = {...existingProvider, ...provider};
            this.cache.set(updatedProvider.id, updatedProvider);
            await this.flush(Array.from(this.cache.values()));
            return updatedProvider;
        });
    }

    private flush(providers: HealthcareProvider[]): Promise<void> {
        // write the providers to the file
        return fs.writeFile(this.filePath, JSON.stringify(providers, null, 2));
    }

    private load(): HealthcareProvider[] {
        return JSON.parse(readFileSync(this.filePath, 'utf-8'));
    }
}