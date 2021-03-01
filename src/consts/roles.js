const ADMIN = 0x01;
const PILOT = 0x02;
const REGISTRAR = 0x04;

const ROLES_ALLOWED = new Set([
    ADMIN,
    PILOT,
    REGISTRAR
]);

const ROLES_VALUES = new Map([
    ['ADMIN', ADMIN],
    ['PILOT', PILOT],
    ['REGISTRAR', REGISTRAR],
])

module.exports = {
    roles: ROLES_VALUES,
    roles_allowed: ROLES_ALLOWED,
}