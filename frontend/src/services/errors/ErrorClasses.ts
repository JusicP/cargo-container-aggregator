export class AuthExpiredError extends Error {
    constructor() {
        super("Authentication expired");
        this.name  = "AuthExpiredError";
    }
}

export class NetworkConnectionError extends Error {
    constructor() {
        super("Network connection error");
        this.name  = "NetworkConnectionError";
    }
}

export class ForbiddenError extends Error {
    constructor() {
        super("Access forbidden error");
        this.name  = "AccessForbiddenError";
    }
}

export class NotFoundError extends Error {
    constructor() {
        super("Content Not Found");
        this.name  = "NotFoundError";
    }
}

export class RateLimitError extends Error {
    constructor() {
        super("Rate Limit error");
        this.name  = "RateLimitError";
    }
}