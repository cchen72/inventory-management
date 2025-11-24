package com.stori.fundcore.cif.utils;
/*
    Copyright (c) Powerup Technology Inc. All rights reserved.
*/

import java.time.Duration;
import java.util.concurrent.atomic.AtomicInteger;

import org.slf4j.Logger;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;

/**
 * 日志工具类，用于在指定时间内抑制重复日志输出。
 *
 * @author ian.chen
 * @date 2025/11/13 20:04
 **/
public class LogUtils {
    private final static Cache<String, AtomicInteger> CACHE = CacheBuilder
            .newBuilder()
            .maximumSize(20)
            .expireAfterWrite(Duration.ofMinutes(1))
            .build();

    public static void logWithSuppress(String scene, int maxTime, Logger log, String msg, Object... param) {
        try {
            int counter = CACHE.get(scene, AtomicInteger::new).incrementAndGet();
            if (counter <= maxTime) {
                log.error(msg, param);
            } else {
                log.warn(msg, param);
            }
        } catch (Exception e) {
            log.error("Error logging with suppress", e);
        }
    }
}
