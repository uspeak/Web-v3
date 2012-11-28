from fabric.api import *
from fabric.contrib.project import rsync_project

@hosts('syrus@uspeakapp.com')
def sync():
    local('brunch build --minify')
    # gitignore = file('.gitignore')
    # excludes = [line.strip() for line in gitignore.readlines()]
    # excludes.append('.git/*')
    rsync_project("/home/uspeak/games/v3", "public/",exclude=[])
    #restart()

def build():
    commit_msg = 'Updated source'
    local('brunch build -c cordova-config --minify')
    with lcd('build/uspeak-cordova/'):
        local('git add .')
        local('git commit -m "%s"'%commit_msg)
        local('git push -u origin master')
    local('git submodule update')

@hosts('syrus@uspeakapp.com')
def restart():
    run('sudo /etc/init.d/httpd restart')