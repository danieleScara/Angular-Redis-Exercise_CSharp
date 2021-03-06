﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ServiceStack.Redis;
using StackExchange.Redis;
using Newtonsoft.Json;
using System.Net.Http;

namespace Angular_Exercise_CSharp.Controllers
{
    public class Person {
        
        public string name { get; set; }
        public string surname { get; set; }
        public string birthDate { get; set; }
        public long id { get; set; }
    }

    [Route("")]
    public class ValuesController : Controller
    {
        ConnectionMultiplexer redis = ConnectionMultiplexer.Connect("localhost, allowAdmin=true");


        // GET api/values
        [HttpGet("listPersons")]
        public JsonResult Get()
        {
            /*RedisClient redisClient = new RedisClient("localhost", 6379); 
            List<string> allKeys = redisClient.GetAllKeys();
            List<Dictionary<string,string>> persons = new List<Dictionary<string, string>>();
            int numKeys = allKeys.Count();
            foreach (string item in allKeys)
            {
                persons.Add(redisClient.GetAllEntriesFromHash(item));
            }
            return Json(persons);*/

            /*using (IRedisClient client = new RedisClient())
            {
                var personClient = client.As<Person>();
                var persons = personClient.GetAll();
                return Json(persons);
            }*/
               
            //Using StackExchange.Redis
            var db = redis.GetDatabase();
            var server = redis.GetServer("localhost",6379);
            var personKeys = server.Keys(pattern: "person:*");
            List<Person> persons = new List<Person>();
            foreach (var item in personKeys) {
                var current = db.HashGetAll(item);
                Person temp = new Person
                {
                    id = (long)current[0].Value,
                    name = (string)current[1].Value,
                    surname = (string)current[2].Value,
                    birthDate = (string)current[3].Value,
                };
                persons.Add(temp);
            }
            return Json(persons);
        }

        // POST 
        [HttpPost("addPerson")]
        public void Post([FromBody] dynamic person)
        {
            /*RedisClient redisClient = new RedisClient("localhost", 6379);
            byte[][] values = new byte[4][];
            values[0] = System.Text.Encoding.ASCII.GetBytes((string)person.id);
            values[1] = System.Text.Encoding.ASCII.GetBytes((string)person.name);
            values[2] = System.Text.Encoding.ASCII.GetBytes((string)person.surname);
            values[3] = System.Text.Encoding.ASCII.GetBytes((string)person.birthDate);

            string a1 = System.Text.Encoding.Default.GetString(values[0]);
            string a2 = System.Text.Encoding.Default.GetString(values[1]);
            string a3 = System.Text.Encoding.Default.GetString(values[2]);
            string a4 = System.Text.Encoding.Default.GetString(values[3]);

            byte[][] keys = new byte[4][];
            keys[0] = System.Text.Encoding.ASCII.GetBytes("id");
            keys[1] = System.Text.Encoding.ASCII.GetBytes("name");
            keys[2] = System.Text.Encoding.ASCII.GetBytes("surname");
            keys[3] = System.Text.Encoding.ASCII.GetBytes("birthDate");

            redisClient.HMSet("person:" + person.id, keys, values);*/

            /*using (IRedisClient client = new RedisClient())
            {
                var personClient = client.As<Person>();
                personClient.Store(new Person() { id = (long)person.id, name = person.name, surname = person.surname, birthDate = person.birthDate });
            }*/

            //Using StackExchange.Redis
            var db = redis.GetDatabase();
            db.HashSet("person:" + person.id, new HashEntry[] {
                new HashEntry("id", (long)person.id),
                new HashEntry("name", (string)person.name),
                new HashEntry("surname", (string)person.surname),
                new HashEntry("birthDate", (string)person.birthDate)
            });

            //another way to do the same thing
            /*redisClient.SetEntryInHashIfNotExists("person:" + person.id, "id", (string)person.id);
            redisClient.SetEntryInHash("person:" + person.id, "name", (string)person.name);
            redisClient.SetEntryInHash("person:" + person.id, "surname", (string)person.surname);
            redisClient.SetEntryInHash("person:" + person.id, "birthDate", (string)person.birthDate);*/
        }

        // DELETE 
        [HttpDelete("deletePerson/{id}")]
        public void Delete( int id)
        {
            /*RedisClient redisClient = new RedisClient("localhost", 6379);
            redisClient.Del("person:"+id);*/

            /*using (IRedisClient client = new RedisClient())
            {
                var personClient = client.As<Person>();
                var person = personClient.GetById(id);
                personClient.Delete(person);
            }*/

            //Using StackExchange.Redis
            var db = redis.GetDatabase();
            db.HashDelete("person:" + id, "id");
            db.HashDelete("person:" + id, "name");
            db.HashDelete("person:" + id, "surname");
            db.HashDelete("person:" + id, "birthDate");

            //another way to do the same thing
            /*redisClient.HDel("person:" + id, System.Text.Encoding.ASCII.GetBytes("id"));
            redisClient.HDel("person:" + id, System.Text.Encoding.ASCII.GetBytes("name"));
            redisClient.HDel("person:" + id, System.Text.Encoding.ASCII.GetBytes("surname"));
            redisClient.HDel("person:" + id, System.Text.Encoding.ASCII.GetBytes("birthDate"));*/
        }
    }
}
