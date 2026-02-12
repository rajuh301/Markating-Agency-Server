import express, { Application, Request, Response, NextFunction } from "express"
import cors from "cors"
import router from "./app/routes";
import globalErrorHandler from "./app/middleWares/globalErrorHandlere";
import cookieParser from 'cookie-parser'

const app: Application = express();
app.use(cors());

//Purser
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get('/', (req: Request, res: Response) => {
    res.send({
        message: "Markating-agency server is running successfully!"
    })
});


app.use("/api/v1/", router);

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({

        sussess: false,
        message: "API NOT FOUND!",
        error: {
            patah: req.originalUrl,
            message: "Your requested path is not found!"
        }

    })
})


export default app;