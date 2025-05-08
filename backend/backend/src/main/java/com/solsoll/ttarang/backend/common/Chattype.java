package com.solsoll.ttarang.backend.common;

public enum Chattype {
    project,
    marketing,
    planning;

    @Override
    public String toString() {
        return name().toLowerCase();
    }
}
