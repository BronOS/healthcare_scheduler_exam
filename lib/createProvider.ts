import type {NextApiRequest, NextApiResponse} from "next";
import {HealthcareProvider, NewHealthcareProvider} from "../interfaces/types";
import {container} from "../inversify.config";
import {ProvidersRepository} from "./providersRepository";
import {CreateProviderSchema} from "../interfaces/schemas";
import {is} from "superstruct";

const providerRepository = container.get<ProvidersRepository>('ProvidersRepository');

export default function createProvider(
    req: NextApiRequest,
    res: NextApiResponse<HealthcareProvider>,
) {
    const provider = req.body as NewHealthcareProvider;

    // validate the provider object
    if (!isValid(provider)) {
        return res.status(400).end('Provider is invalid');
    }

    // create the provider
    return providerRepository.create(provider).then(provider => {
        return res.status(201).json(provider);
    }).catch(error => {
        console.error(error);
        return res.status(500).end('An error occurred while creating the provider');
    });
}

function isValid(provider: NewHealthcareProvider): boolean {
    return is(provider, CreateProviderSchema);
}