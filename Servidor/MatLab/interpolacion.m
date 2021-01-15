function y = interpolacion()
TIPOGASES = ["GI", "NO2", "O3", "SO2", "CO2"];
format long;
%[x]Generar JSON
%[x]INTERPOLAR*
%[]Falta crear historico de mapas
%[x]Falta sacar mediciones interpoladas con sus lat long + las de entrada
%
%JSONFILE_HISTORICO= sprintf('%s_JSON%d.json',Date(),1);



JSONFILE_name= '../Datos/medicionesInterpoladas.json';
fid=fopen(JSONFILE_name,'w');
fprintf(fid, '[');

for tg=1:length(TIPOGASES)
    
    
    M = readmatrix(strcat('../Datos/',TIPOGASES(tg),'medicionesBD.txt'));
    fprintf(fid, strcat('{"TipoMedicion":"',TIPOGASES(tg),'","mediciones":['));
    if isempty(M) 
    
    else
    Lat=M([1],:);
    Lon=M([2],:);
    Val=M([3],:);
    %Añadimos 0 a las esquinas
    Lat(length(Lat)+1) = 38.869172;
    Lat(length(Lat)+1) = 38.869172;
    Lat(length(Lat)+1) = 39.018634;
    Lat(length(Lat)+1) = 39.018634;
    
    Lon(length(Lon)+1) = -0.245314;
    Lon(length(Lon)+1) = -0.137187;
    Lon(length(Lon)+1) = -0.245314;
    Lon(length(Lon)+1) = -0.137187;
    
    Val(length(Val)+1) = 0;
    Val(length(Val)+1) = 0;
    Val(length(Val)+1) = 0;
    Val(length(Val)+1) = 0;
    
    % Puntos de la costa
    Lat(length(Lat)+1) = 38.896449;
    Lon(length(Lon)+1) = -0.048689;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 38.899009;
    Lon(length(Lon)+1) =  -0.055268;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 38.904129; 
    Lon(length(Lon)+1) =  -0.061847;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 38.910346;  
    Lon(length(Lon)+1) =  -0.068897;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 38.919730;  
    Lon(length(Lon)+1) =  -0.079515;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 38.923672;  
    Lon(length(Lon)+1) =   -0.085216;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 38.927368;   
    Lon(length(Lon)+1) =   -0.089016;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 38.934266;    
    Lon(length(Lon)+1) =   -0.097884;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 38.938701;
    Lon(length(Lon)+1) = -0.101684;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 38.941903; 
    Lon(length(Lon)+1) = -0.105801;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 38.945598; 
    Lon(length(Lon)+1) = -0.109602;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 38.950278;  
    Lon(length(Lon)+1) = -0.114352;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 38.953479;  
    Lon(length(Lon)+1) = -0.1178362;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 38.958159;  
    Lon(length(Lon)+1) = -0.123853;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 38.962838;   
    Lon(length(Lon)+1) = -0.126704;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 38.966531;    
    Lon(length(Lon)+1) = -0.131137;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 38.970717;    
    Lon(length(Lon)+1) = -0.135888;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 38.975149;     
    Lon(length(Lon)+1) = -0.140005;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 38.980073;      
    Lon(length(Lon)+1) = -0.144439;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 38.984751;       
    Lon(length(Lon)+1) = -0.148239;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 38.989182;      
    Lon(length(Lon)+1) = -0.150140;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 38.994351;      
    Lon(length(Lon)+1) = -0.148873;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 38.998535;      
    Lon(length(Lon)+1) = -0.152673;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 39.002227;    
    Lon(length(Lon)+1) = -0.156790;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 39.009685;     
    Lon(length(Lon)+1) = -0.161805;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 39.012006;      
    Lon(length(Lon)+1) = -0.165942;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 39.015756;      
    Lon(length(Lon)+1) = -0.168700;
    Val(length(Val)+1) = 0;
    %---------------------
    Lat(length(Lat)+1) = 39.017006;       
    Lon(length(Lon)+1) = -0.170538;
    Val(length(Val)+1) = 0;
    
    % GRID PARA ZONA GND
    % lat1=38.869172:3.6015e-04:39.018634
    % long1=-0.245314:4.6208e-04:-0.137187
    
     LatStep = 3.6015e-04;
     LonStep = 4.6208e-04;
%     
%     if (max(Lat)- min(Lat)) < LatStep
%         LatStep = (max(Lat)- min(Lat))/10;
%     end
%     if (max(Lon)- min(Lon)) < LonStep
%         LonStep = (max(Lon)- min(Lon))/10;
%     end
%     
%     latGRID = (min(Lat)):LatStep: (max(Lat));
%     lonGRID = (min(Lon)):LonStep: (max(Lon));
    
    latGRID = 38.869172 :LatStep: 39.018634;
    lonGRID = -0.245314 :LonStep: -0.137187;
    
    [LATGRID,LONGRID]=meshgrid(latGRID,lonGRID);
    
    values = griddata(Lat,Lon,Val,LATGRID,LONGRID,'v4');
    values = max(0,min(100,values));
     %figure(tg)
     %mesh(LATGRID,LONGRID,values);
     %hold on;
     %plot3(Lat,Lon,Val,"O");
     %title(TIPOGASES(tg));
     
        for row=1:size(values, 1)
            for col=1:size(values, 2)
                value=round(values(row, col),4);
                if value < 0
                   value = 0; 
                end
                s = struct("lat",latGRID(col), "lon", lonGRID(row) , "value", value); 
                encodedJSON = jsonencode(s); 
                
                fprintf(fid, encodedJSON);

                if row == size(values, 1) && col == size(values, 2)
                    
                else
                    fprintf(fid, ',');
                end
            end   
        end
        max(max(values))
        min(min(values))
    end
    fprintf(fid, ']}');
    if tg < length(TIPOGASES)
        fprintf(fid, ',');
    end
end

fprintf(fid,']');

%pcolor(LATGRID,LONGRID ,values); shading interp, colorbar;
fclose('all');
exit;
end