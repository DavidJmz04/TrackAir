package com.example.serpumar.sprint0_3a.Models;

public class Ubicacion {

    private double Latitud;
    private double Longitud;

    public Ubicacion(double Latitud_, double Longitud_) {
        this.Latitud = Latitud_;
        this.Longitud = Longitud_;
    }

    public double getLatitud() {
        return Latitud;
    }

    public void setLatitud(double latitud) {
        Latitud = latitud;
    }

    public double getLongitud() {
        return Longitud;
    }

    public void setLongitud(double longitud) {
        Longitud = longitud;
    }







}
