import type {NextApiRequest, NextApiResponse} from "next";
import {UpdateHealthcareProvider} from "../interfaces/types";
import {container} from "../inversify.config";
import {ProvidersRepository} from "./providersRepository";
import {is} from "superstruct";
import {UpdateProviderSchema} from "../interfaces/schemas";

const providerRepository = container.get<ProvidersRepository>('ProvidersRepository');

export default function updateProvider(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const provider = req.body as UpdateHealthcareProvider;

    if (!isValid(provider)) {
        return res.status(400).end('The provider id is required');
    }

    return providerRepository.update(provider).then(provider => {
        return res.status(200).json(provider);
    }).catch(error => {
        console.error(error);
        return res.status(500).end(`An error occurred while updating the provider with id ${provider.id}`);
    });
}

function isValid(provider: UpdateHealthcareProvider): boolean {
    return is(provider, UpdateProviderSchema);
}