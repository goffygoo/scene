import express from "express";
import Module from '../../service/auth/user.js';
import { parseAppConfig, validateSchema, verifyAccessToken, wrapper } from "../middleware.js";
import { GENDER } from "../../constants/index.js";

const updateProfileSchema = {
    type: "object",
    properties: {
        name: { type: "string" },
        dob: {
            type: "object",
            properties: {
                day: { type: "number", minimum: 1, maximum: 31 },
                month: { type: "number", minimum: 0, maximum: 11 },
                year: { type: "number", minimum: 1900, maximum: 2100 },
            },
            additionalProperties: false,
            required: [
                'day',
                'month',
                'year'
            ],
        },
        gender: {
            enum: [GENDER.MALE, GENDER.FEMALE, GENDER.OTHER],
        },
    },
    required: [
        'name',
        'dob',
        'gender'
    ],
    additionalProperties: false,
};

const router = express.Router();

router.post('/login', wrapper(Module.service.login));
router.post('/newAccessToken', wrapper(Module.service.newAccessToken));
router.post('/verifyOtp', parseAppConfig, wrapper(Module.service.verifyOtp));
router.post('/googleLogin', parseAppConfig, wrapper(Module.service.googleLogin));
router.post(
    '/updateProfile',
    // validateSchema(updateProfileSchema),
    verifyAccessToken,
    wrapper(Module.service.updateProfile)
);

export default router;