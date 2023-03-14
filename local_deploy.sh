DEPLOYMENT_DIR="/home/kadament/Documents/gnar/gnar_repo/test_deployment/"
DEVELOPMENT_DIR="/var/www/html/kadamentwp1/wp-content/plugins/"
PLUGIN_NAME=$(basename "$PWD")
PLUGIN_PATH=$PWD
NEW_PLUGIN_NAME=${PLUGIN_NAME/./}

# clear deployment_dir
rm -rf "${DEPLOYMENT_DIR}""${PLUGIN_NAME}"
rm -rf "${DEPLOYMENT_DIR}""${NEW_PLUGIN_NAME}"
rm -rf "${DEPLOYMENT_DIR}""${NEW_PLUGIN_NAME}".zip

# copies it to local repo ~/Documents/gnar/gnar_repo/test_deployment/
cp -r $PLUGIN_PATH $DEPLOYMENT_DIR

# change to deployment dir
cd $DEPLOYMENT_DIR

# remove '.' from folder name
mv "${PLUGIN_NAME}" "${NEW_PLUGIN_NAME}"

# deletes .git, readme, and the bash script
cd "${NEW_PLUGIN_NAME}"
sudo rm -rf .git README.md local_deploy.sh
cd ..

# copies it to development plugins
cp -r $NEW_PLUGIN_NAME $DEVELOPMENT_DIR

# creates zip (for the install version)
zip -r "${NEW_PLUGIN_NAME}".zip "${NEW_PLUGIN_NAME}"