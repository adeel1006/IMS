// import { TypeOrmModuleOptions } from "@nestjs/typeorm";

// const config : TypeOrmModuleOptions = {
//     type: "postgres",
//     host: "localhost",
//     port: 5432,
//     username: "postgres",
//     password: "root",
//     database : 'IMS',
//     // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//     entities: ['dist/**/*.entity.js'],
//     synchronize: true,
// };

// export default config;







// import { TypeOrmModuleOptions } from "@nestjs/typeorm";

// const config : TypeOrmModuleOptions = {
//     type: 'postgres',
//     host: process.env.DB_HOST,
//     port: parseInt(<string>process.env.DB_PORT),
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database : process.env.DB_DATABASE,
//     entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//     synchronize: true,
// };
// console.log(config);

// export default config;




      // type: process.env.DB_TYPE as any,
      // host: process.env.DB_HOST,
      // port: parseInt(process.env.DB_PORT),
      // username: process.env.DB_USERNAME,
      // password: process.env.DB_PASSWORD,
      // database: process.env.DB_NAME,
      // entities: ['dist/**/*.entity.js'],
      // synchronize: true,