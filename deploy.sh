#! /bin/bash
set -euo

<<<<<<< HEAD
host="47.92.151.165:8080"
#host="18.188.85.82:8080"
=======
host=${M3_HOST}
>>>>>>> fcc724743c0c405f2110839e6d4aa91fb3d0250c
company="wecise"
auth="${company}.admin:admin"
target="app.zip"

echo
echo '应用发布开始**********************************************************************'
echo
echo '发布地址：'@${host}
echo
echo '发布租户：'${company}
echo

curl --location -u "${auth}" -X POST "http://$host/fs/import?issys=true" --form "uploadfile=@${target}"

echo
rm -rf ${target}
echo '应用发布结束**********************************************************************';
