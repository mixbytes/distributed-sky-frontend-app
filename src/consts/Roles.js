const ADMIN = 0x01;
const PILOT = 0x02;
const REGISTRAR = 0x04;

const ROLES_ALLOWED = new Set([
    ADMIN,
    PILOT,
    REGISTRAR,
]);

const ROLE_VALUES = new Map([
    ['ADMIN', ADMIN],
    ['PILOT', PILOT],
    ['REGISTRAR', REGISTRAR],
]);

const Roles = {
    roleValues: ROLE_VALUES,
    rolesAllowed: ROLES_ALLOWED,
};

export default Roles;
