import type {NextApiRequest, NextApiResponse} from "next";
import {HealthcareData} from "../interfaces/types";
import {container} from "../inversify.config";
import {ProvidersRepository} from "./providersRepository";

const providerRepository = container.get<ProvidersRepository>('ProvidersRepository');

export default function listProviders(
    req: NextApiRequest,
    res: NextApiResponse<HealthcareData>,
) {
    return providerRepository.findAll().then(providers => {
        // create a response object
        const data: HealthcareData = {providers};
        // send the response
        return res.status(200).json(data);
    }).catch(error => {
        console.error(error);
        return res.status(500).end({providers: [], error: 'An error occurred while fetching the providers.'});
    })
}
