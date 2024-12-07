import { Router } from 'express';
import {
    getWalletByUserId,
    addFundsToWallet,
    deductFundsFromWallet,
    listWalletTransactions,
    createWallet,
    listWallets,
} from '@src/controllers/7_walletController';
import { auth } from '@src/middlewares/authenticate';
import { ROUTES } from '@src/constants';

const router = Router();

// Crear una nueva billetera
router.post(ROUTES.WALLET.CREATE, auth, createWallet);

// Obtener la billetera de un usuario específico
router.get(ROUTES.WALLET.BY_USER, auth, getWalletByUserId);

// Agregar fondos a la billetera de un usuario
router.post(ROUTES.WALLET.ADD_FUNDS, auth, addFundsToWallet);

// Deducir fondos de la billetera de un usuario
router.post(ROUTES.WALLET.DEDUCT_FUNDS, auth, deductFundsFromWallet);

// Listar transacciones asociadas a la billetera de un usuario
router.get(ROUTES.WALLET.TRANSACTIONS, auth, listWalletTransactions);

// Listar transacciones asociadas a la billetera de un usuario
router.get(ROUTES.WALLET.BASE, auth, listWallets);

export default router;
