import { DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

export class MongoModule {
  constructor() {}
  static forRootAsync(): DynamicModule {
    return MongooseModule.forRootAsync({
      useFactory: () => {
        return {
          connectionFactory: (connection) => {
            if (connection.readyState === 1) {
              console.log('Database Connected successfully');
            }
            connection.on('disconnected', () => {
              console.log('Database disconnected');
            });
            connection.on('error', (error) => {
              console.log('Database connection failed!');
            });
            return connection;
          },
          uri: `mongodb+srv://${process.env.DBUSERNAME}:${process.env.DBPASSWORD}@${process.env.DBCLUSTER}/${process.env.DBNAME}`,
          maxPoolSize: 50,
        };
      },
    });
  }
}
