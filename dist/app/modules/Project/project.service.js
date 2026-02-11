"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createProject = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.project.create({
        data: {
            name: payload.name,
            description: payload.description,
            budget: payload.budget,
            status: payload.status || 'PLANNING',
            clientId: payload.clientId,
            organizationId: payload.organizationId,
            startDate: payload.startDate ? new Date(payload.startDate) : null,
            endDate: payload.endDate ? new Date(payload.endDate) : null,
        }
    });
    return result;
});
const getAllProjects = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.project.findMany({
        include: {
            client: true, // প্রজেক্টের সাথে ক্লায়েন্টের তথ্য দেখার জন্য
        }
    });
});
exports.ProjectService = { createProject, getAllProjects };
