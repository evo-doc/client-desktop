yarn packager:mac
tar -cvzf "release/EvoDoc-macOS-x64.tar.gz" -C "release/EvoDoc-darwin-x64/" "EvoDoc.app"
yarn packager:lin
tar -cvzf "release/EvoDoc-linux-x64.tar.gz" -C "release/EvoDoc-linux-x64" .
