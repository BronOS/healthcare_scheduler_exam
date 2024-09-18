import type {NextApiRequest, NextApiResponse} from "next";
import {container} from "../inversify.config";
import {ProvidersRepository} from "./providersRepository";

const providerRepository = container.get<ProvidersRepository>('ProvidersRepository');

export default function deleteProvider(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    return providerRepository.delete(req.query.id as string).then(() => {
        return res.status(204).end();
    }).catch(error => {
        console.error(error);
        return res.status(500).end(`An error occurred while deleting the provider with id ${req.query.id}`);
    });
}
