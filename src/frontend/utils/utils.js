export function min(...values) {
    let res = values[0];
    for (const value of values) {
        if (res > value) {
            res = value;
        }
    }
      
    return res;
}

export function max(...values) {
    let res = values[0];
    for (const value of values) {
        if (res < value) {
            res = value;
        }
    }
      
    return res;
}

export function abs(value) {
    return (value >= 0) ? value : -value;
}

export const OPPONENT = {
    'npc': 'player', 
    'player': 'npc', 
    'player1': 'player2', 
    'player2': 'player1'
}

export function is_equal_list(a, b) {
    if (a == null || b == null) {
        return false;
    }

    if (a.length != b.length) {
        return false;
    }

    for (let i = 0; i < a.length; i++) {
        if (a[i] != b[i]) {
            return false;
        }
    }
    
    return true;
}