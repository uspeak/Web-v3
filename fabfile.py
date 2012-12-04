from fabric.api import *
from fabric.contrib.project import rsync_project

@hosts('syrus@uspeakapp.com')
def sync():
    build('web')
    rsync_project("/home/uspeak/games/v3", "build/uspeak-web/")

def build(*args):
    base_envs = ['cordova']
    envs = base_envs if not args else args
    for name in envs:
        commit_msg = 'Updated source of %s'%name
        with lcd('app/assets/'):
            local('cp index-%s.html index.html'%name)
        local('brunch build -c config-%s --minify'%name)
        with lcd('build/uspeak-%s/'%name):
            try:
                local('rm index-*.html')
            except:
                pass
            if name=='cordova':
                local('rm -rf swf/')
            local('git add .')
            local('git commit -m "%s"'%commit_msg)
            local('git push -u origin master')
    # local('git submodule update')
    local('git add .')
    local('git commit -m "Updated submodules"')

def debug(name):
    with lcd('app/assets/'):
        local('cp index-%s.html index.html'%name)
    local('brunch watch -c config-%s -s'%name)

@hosts('syrus@uspeakapp.com')
def restart():
    run('sudo /etc/init.d/httpd restart')