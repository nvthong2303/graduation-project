import morgan from 'morgan';
import compression from 'compression';
import bodyParse from 'body-parser';
import helmet from 'helmet';

export default function expressConfig(app) {
    // security middleware
    app.use(helmet());

    app.use(compression());
    app.use(bodyParse.json({ limit: '50mb' }));
    app.use(
        bodyParse.urlencoded({
            limit: '50mb',
            extended: true,
            parameterLimit: 50000
        })
    );

    app.use((req, res, next) => {
        res.setHeader(
            'Access-Control-Allow-Methods',
            'GET, POST, PUT, DELETE, PATCH, OPTIONS'
        );
        res.setHeader(
            'Access-Control-Allow-Headers',
            'X-Requested-With, Content-type, Authorization, Cache-control, Pragma'
        );
        next();
    });
    app.use(morgan('combined'))
}