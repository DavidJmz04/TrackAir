package com.example.serpumar.sprint0_3a;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;

import static android.content.Context.NOTIFICATION_SERVICE;

public class NotificacionManagerT {
    private static NotificacionManagerT instance = null;
    public static Context ctx;

    long ultimoTiempoRegistrado;

    Intent notificationIntent = new Intent();
    PendingIntent pendingIntent = PendingIntent.getActivity(ctx,
            0, notificationIntent, 0);
    android.app.NotificationManager notificationManager =
            (android.app.NotificationManager) ctx.getSystemService(NOTIFICATION_SERVICE);

    private NotificacionManagerT(Context context) {
        ctx = context.getApplicationContext();
    }

    public static synchronized NotificacionManagerT getInstance() {
        if (null != instance) {
            return instance;
        }
        return null;
    }

    public static synchronized NotificacionManagerT getInstance(Context context) {
        if (null == instance) instance = new NotificacionManagerT(context);
        return instance;
    }


}
