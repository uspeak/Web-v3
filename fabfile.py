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

def build(*args):
    base_envs = ['cordova']
    envs = base_envs if not args else args
    for name in envs:
        commit_msg = 'Updated source of %s'%name
        local('brunch build -c config-%s --minify'%name)
        with lcd('build/uspeak-%s/'%name):
            local('mv index-%s.html index.html'%name)
            try:
                local('rm index-*.html')
            except:
                pass
            if name=='cordova':
                local('rm -rf swf')
            local('git add .')
            local('git commit -m "%s"'%commit_msg)
            local('git push -u origin master')
    local('git submodule update')
    local('git commit -m "Updated submodules"')

def debug(name):
    local('brunch watch -c config-%s -s'%name)
    with lcd('build/uspeak-%s/'%name):
        local('mv index-%s.html index.html'%name)

@hosts('syrus@uspeakapp.com')
def restart():
    run('sudo /etc/init.d/httpd restart')