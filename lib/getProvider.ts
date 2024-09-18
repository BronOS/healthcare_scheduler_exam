import type {NextApiRequest, NextApiResponse} from "next";
import {HealthcareProvider, NewHealthcareProvider} from "../interfaces/types";
import {container} from "../inversify.config";
import {ProvidersRepository} from "./providersRepository";
import {CreateProviderSchema} from "../interfaces/schemas";
import {is} from "superstruct";

const providerRepository = container.get<ProvidersRepository>('ProvidersRepository');

export default function getProvider(
    req: NextApiRequest,
    res: NextApiResponse<HealthcareProvider>,
) {
    return providerRepository.findById(req.query.id as string).then(provider => {
        if (!provider) {
            return res.status(404).end(`Provider with id ${req.query.id} Not Found`);
        }
        return res.status(200).json(provider);
    }).catch(error => {
        console.error(error);
        return res.status(500).end(`An error occurred while fetching the provider with id ${req.query.id}`);
    });
}
