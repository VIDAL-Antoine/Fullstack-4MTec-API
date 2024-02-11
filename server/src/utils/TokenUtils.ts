let blacklist: string[] = [];

function revokeToken(token: string): void {
    blacklist.push(token);
}

function isTokenRevoked(token: string): boolean {
    return blacklist.includes(token);
}

export { revokeToken, isTokenRevoked };
