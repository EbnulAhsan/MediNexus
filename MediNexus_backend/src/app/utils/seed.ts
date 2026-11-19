import { Role } from "../../generated/prisma/enums"
import config from "../config"
import { prisma } from "../lib/prisma"
import bcrypt from "bcryptjs"

export const seedSuperAdmin = async () => {
    try {

        const isSuperAdminExist = await prisma.user.findFirst({
            where: {
                role: Role.SUPER_ADMIN
            }
        })

        if (isSuperAdminExist) {
            console.log("super admin already exists ")

            return
        }

        const name = config.super_admin_name
        const email = config.super_admin_email
        const password = config.super_admin_password


        if (!name || !email || !password) {
            throw new Error("Super Admin name , email or pass is missing in env file !!!!")
        }










        // hashing the password

        const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))

        // creating super admin----

        const superAdmin = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: Role.SUPER_ADMIN,
                needPasswordChange: false,
                emailVerified: true
            }
        })

        console.log("super admin has been created sucessfully : ", superAdmin)






    } catch (error) {

        console.log("error seeding super admin  : ", error)


        await prisma.user.delete({
            where: {
                email: config.super_admin_email
            }
        })

    }
}

const createTesterUser = async (tester: { name: string; email: string; password: string; role: Role }) => {
    try {
        const exists = await prisma.user.findFirst({ where: { email: tester.email } })

        if (exists) {
            console.log(`${tester.role} tester already exists : ${tester.email}`)
            return
        }

        const hashedPassword = await bcrypt.hash(tester.password, Number(config.bcrypt_salt_rounds))

        await prisma.user.create({
            data: {
                name: tester.name,
                email: tester.email,
                password: hashedPassword,
                role: tester.role,
                needPasswordChange: false,
                emailVerified: true,
            },
        })

        console.log(`${tester.role} tester created : ${tester.email}`)
    } catch (error) {
        console.log(`error seeding ${tester.role} tester : `, error)
    }
}



export const seedTesterAdmin = () =>
    createTesterUser({
        name: config.tester_admin_name,
        email: config.tester_admin_email,
        password: config.tester_admin_password,
        role: Role.ADMIN,
    })

export const seedTesterDoctor = () =>
    createTesterUser({
        name: config.tester_doctor_name,
        email: config.tester_doctor_email,
        password: config.tester_doctor_password,
        role: Role.DOCTOR,
    })
