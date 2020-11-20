package com.example.serpumar.sprint0_3a.ClasesPojo;

import java.io.Serializable;

public class FiltrosMapaPojo implements Serializable {
    private String titulo;
    private String filtroActivo;

    public FiltrosMapaPojo(String titulo, String filtroActivo) {
        this.titulo = titulo;
        this.filtroActivo = filtroActivo;
    }

    public String getTitle() {
        return titulo;
    }

    public void setTitle(String title) {
        this.titulo = title;
    }

    public String getActiveFilter() {
        return filtroActivo;
    }

    public void setActiveFilter(String activeFilter) {
        this.filtroActivo = activeFilter;
    }
}
